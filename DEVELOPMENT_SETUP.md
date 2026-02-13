# Development Setup Guide

This document outlines the proper development setup and workflow for the Adorzia project.

## Port Allocation

To avoid port conflicts during development, we use the following port allocation:

- Main Application: `8085`
- Studio Application: `8086`
- Admin Panel: `8087`

## Available Scripts

- `npm run dev` - Start the main application on port 8085
- `npm run dev:studio` - Start the studio application on port 8086
- `npm run dev:admin` - Start the admin panel on port 8087
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:
1. Check if another process is using the intended port: `netstat -tulpn | grep :PORT_NUMBER`
2. Kill the process if necessary: `sudo kill -9 PID`
3. Or use a different port by specifying it in the command: `npm run dev -- --port NEW_PORT`

### Blank Screen Issues
If you see a blank screen:
1. Verify that `src/main.tsx` is importing and rendering the `App` component
2. Check the browser console for JavaScript errors
3. Ensure all required environment variables are set in `.env`

## Development Best Practices

1. Always use the designated ports to avoid conflicts with other developers
2. Don't commit test code or debug components to main branches
3. Use proper error boundaries to catch and display errors gracefully
4. Keep environment variables secure and don't commit them to version control