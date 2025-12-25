import { useMemo } from "react";

interface GreetingOptions {
  name?: string | null;
  isFirstLogin?: boolean;
  joinedAt?: string | null;
}

export function useGreeting({ name, isFirstLogin, joinedAt }: GreetingOptions) {
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    const day = now.getDate();
    const displayName = name || "Designer";

    // First-time user greeting
    if (isFirstLogin) {
      return {
        title: `Welcome to Adorzia, ${displayName}!`,
        subtitle: "Let's begin your creative journey. Start with a walkthrough to learn the platform.",
        isSpecial: true,
        type: "welcome" as const,
      };
    }

    // New Year greeting (Jan 1-7)
    if (month === 0 && day <= 7) {
      return {
        title: `Happy New Year, ${displayName}! 🎆`,
        subtitle: "A fresh year of creative possibilities awaits. Let's make it extraordinary!",
        isSpecial: true,
        type: "newyear" as const,
      };
    }

    // Christmas greeting (Dec 24-26)
    if (month === 11 && day >= 24 && day <= 26) {
      return {
        title: `Happy Holidays, ${displayName}! ✨`,
        subtitle: "Wishing you a season filled with creativity and joy!",
        isSpecial: true,
        type: "christmas" as const,
      };
    }

    // Check for join anniversary (within 3 days of anniversary)
    if (joinedAt) {
      const joinDate = new Date(joinedAt);
      const joinMonth = joinDate.getMonth();
      const joinDay = joinDate.getDate();
      const currentYear = now.getFullYear();
      const joinYear = joinDate.getFullYear();
      
      if (joinMonth === month && Math.abs(joinDay - day) <= 1 && currentYear > joinYear) {
        const yearsOnPlatform = currentYear - joinYear;
        return {
          title: `Happy Anniversary, ${displayName}! 🎉`,
          subtitle: `Celebrating ${yearsOnPlatform} ${yearsOnPlatform === 1 ? 'year' : 'years'} of amazing creativity with us!`,
          isSpecial: true,
          type: "anniversary" as const,
        };
      }
    }

    // Time-based greetings
    let timeGreeting: string;
    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "Good evening";
    } else {
      timeGreeting = "Welcome back";
    }

    // Motivational subtitles that rotate
    const subtitles = [
      "Ready to create something amazing today?",
      "Your creative journey continues here.",
      "Let's bring your vision to life.",
      "Time to design something extraordinary.",
      "Your next masterpiece awaits.",
    ];
    
    const subtitleIndex = day % subtitles.length;

    return {
      title: `${timeGreeting}, ${displayName}`,
      subtitle: subtitles[subtitleIndex],
      isSpecial: false,
      type: "regular" as const,
    };
  }, [name, isFirstLogin, joinedAt]);

  return greeting;
}
