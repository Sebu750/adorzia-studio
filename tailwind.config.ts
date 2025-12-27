import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			display: [
  				'Playfair Display',
  				'serif'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			sans: [
  				'Work Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'Noto Sans',
  				'sans-serif'
  			],
  			serif: [
  				'Lora',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'Inconsolata',
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				glow: 'hsl(var(--accent-glow))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
			admin: {
				background: 'hsl(var(--admin-background))',
				foreground: 'hsl(var(--admin-foreground))',
				card: 'hsl(var(--admin-card))',
				'card-foreground': 'hsl(var(--admin-card-foreground))',
				muted: 'hsl(var(--admin-muted))',
				'muted-foreground': 'hsl(var(--admin-muted-foreground))',
				border: 'hsl(var(--admin-border))',
				accent: 'hsl(var(--admin-accent))',
				'accent-foreground': 'hsl(var(--admin-accent-foreground))',
				sidebar: 'hsl(var(--admin-sidebar))',
				'sidebar-foreground': 'hsl(var(--admin-sidebar-foreground))',
				'sidebar-muted': 'hsl(var(--admin-sidebar-muted))',
				'sidebar-accent': 'hsl(var(--admin-sidebar-accent))',
				'sidebar-border': 'hsl(var(--admin-sidebar-border))',
				wine: 'hsl(var(--admin-wine))',
				'wine-foreground': 'hsl(var(--admin-wine-foreground))',
				camel: 'hsl(var(--admin-camel))',
				'camel-foreground': 'hsl(var(--admin-camel-foreground))',
				coffee: 'hsl(var(--admin-coffee))',
				'coffee-foreground': 'hsl(var(--admin-coffee-foreground))',
				chocolate: 'hsl(var(--admin-chocolate))',
				'chocolate-foreground': 'hsl(var(--admin-chocolate-foreground))',
				apricot: 'hsl(var(--admin-apricot))',
				'apricot-foreground': 'hsl(var(--admin-apricot-foreground))'
			},
			brand: {
				'bright-snow': {
					DEFAULT: '#f8f9fa',
					100: '#29323a',
					200: '#536475',
					300: '#8496a8',
					400: '#bfc8d1',
					500: '#f8f9fa',
					600: '#fafbfc',
					700: '#fbfcfc',
					800: '#fdfdfd',
					900: '#fefefe'
				},
				'platinum': {
					DEFAULT: '#e9ecef',
					100: '#282f37',
					200: '#505f6e',
					300: '#7c8ea0',
					400: '#b3bec8',
					500: '#e9ecef',
					600: '#eef1f3',
					700: '#f3f4f6',
					800: '#f7f8f9',
					900: '#fbfbfc'
				},
				'alabaster': {
					DEFAULT: '#dee2e6',
					100: '#272d34',
					200: '#4e5b67',
					300: '#788899',
					400: '#abb6c0',
					500: '#dee2e6',
					600: '#e5e9ec',
					700: '#eceef1',
					800: '#f2f4f5',
					900: '#f9f9fa'
				},
				'slate': {
					DEFAULT: '#adb5bd',
					100: '#202428',
					200: '#404850',
					300: '#616d79',
					400: '#85919d',
					500: '#adb5bd',
					600: '#bdc4ca',
					700: '#ced3d8',
					800: '#dee1e5',
					900: '#eff0f2'
				},
				'grey': {
					DEFAULT: '#6c757d',
					100: '#161819',
					200: '#2c2f32',
					300: '#41474b',
					400: '#575e64',
					500: '#6c757d',
					600: '#899199',
					700: '#a7adb2',
					800: '#c4c8cc',
					900: '#e2e4e5'
				},
				'iron': {
					DEFAULT: '#495057',
					100: '#0e1011',
					200: '#1d2022',
					300: '#2b2f34',
					400: '#3a3f45',
					500: '#495057',
					600: '#68727d',
					700: '#8c959f',
					800: '#b2b9bf',
					900: '#d9dcdf'
				},
				'gunmetal': {
					DEFAULT: '#343a40',
					100: '#0b0c0d',
					200: '#15171a',
					300: '#202327',
					400: '#2a2f34',
					500: '#343a40',
					600: '#58626c',
					700: '#7d8995',
					800: '#a9b0b8',
					900: '#d4d8dc'
				},
				'carbon': {
					DEFAULT: '#212529',
					100: '#070808',
					200: '#0e0f11',
					300: '#141719',
					400: '#1b1f22',
					500: '#212529',
					600: '#49525b',
					700: '#6f7d8b',
					800: '#9fa8b2',
					900: '#cfd4d8'
				}
			},
  			rank: {
  				f1: 'hsl(var(--rank-f1))',
  				'f1-glow': 'hsl(var(--rank-f1-glow))',
  				f2: 'hsl(var(--rank-f2))',
  				'f2-glow': 'hsl(var(--rank-f2-glow))',
  				novice: 'hsl(var(--rank-novice))',
  				apprentice: 'hsl(var(--rank-apprentice))',
  				designer: 'hsl(var(--rank-designer))',
  				senior: 'hsl(var(--rank-senior))',
  				lead: 'hsl(var(--rank-lead))',
  				elite: 'hsl(var(--rank-elite))',
  				bronze: 'hsl(var(--rank-bronze))',
  				silver: 'hsl(var(--rank-silver))',
  				gold: 'hsl(var(--rank-gold))',
  				platinum: 'hsl(var(--rank-platinum))',
  				diamond: 'hsl(var(--rank-diamond))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: 'var(--shadow-md)',
  			'card-hover': 'var(--shadow-lg)',
  			accent: 'var(--shadow-accent)',
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0',
					opacity: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)',
					opacity: '1'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)',
					opacity: '1'
				},
				to: {
					height: '0',
					opacity: '0'
				}
			},
			'slide-in-from-left': {
				from: {
					opacity: '0',
					transform: 'translateX(-8px)'
				},
				to: {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-in-from-bottom': {
				from: {
					opacity: '0',
					transform: 'translateY(8px)'
				},
				to: {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'icon-bounce': {
				'0%, 100%': {
					transform: 'translateY(0)'
				},
				'50%': {
					transform: 'translateY(-2px)'
				}
			},
  			'fade-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in-down': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-right': {
  				from: {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-in-left': {
  				from: {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			'scale-in': {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'scale-in-center': {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.8)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'pulse-glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 hsl(var(--accent) / 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px 4px hsl(var(--accent) / 0.2)'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'spin-slow': {
  				from: {
  					transform: 'rotate(0deg)'
  				},
  				to: {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'bounce-gentle': {
  				'0%, 100%': {
  					transform: 'translateY(0)',
  					animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
  				},
  				'50%': {
  					transform: 'translateY(-5%)',
  					animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  				}
  			},
  			'blur-in': {
  				from: {
  					opacity: '0',
  					filter: 'blur(10px)'
  				},
  				to: {
  					opacity: '1',
  					filter: 'blur(0)'
  				}
  			},
  			'marquee': {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(-50%)'
  				}
  			}
  		},
		animation: {
			'accordion-down': 'accordion-down 0.25s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.3s ease-out',
			'fade-in-up': 'fade-in-up 0.5s ease-out',
			'fade-in-down': 'fade-in-down 0.5s ease-out',
			'slide-in-right': 'slide-in-right 0.4s ease-out',
			'slide-in-left': 'slide-in-left 0.4s ease-out',
			'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
			'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
			'scale-in': 'scale-in 0.2s ease-out',
			'scale-in-center': 'scale-in-center 0.4s ease-out',
			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			'shimmer': 'shimmer 1.5s ease-in-out infinite',
			'float': 'float 3s ease-in-out infinite',
			'spin-slow': 'spin-slow 8s linear infinite',
			'bounce-gentle': 'bounce-gentle 2s infinite',
			'blur-in': 'blur-in 0.6s ease-out',
			'marquee': 'marquee 25s linear infinite',
			'icon-bounce': 'icon-bounce 0.6s ease-in-out'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
