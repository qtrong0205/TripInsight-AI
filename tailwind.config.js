module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                tertiary: {
                    DEFAULT: "hsl(var(--tertiary))",
                    foreground: "hsl(var(--tertiary-foreground))",
                },
                neutral: {
                    DEFAULT: "hsl(var(--neutral))",
                    foreground: "hsl(var(--neutral-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
                gray: {
                    50: "hsl(0, 0%, 99%)",
                    100: "hsl(210, 25%, 97%)",
                    200: "hsl(220, 20%, 93%)",
                    300: "hsl(218, 15%, 85%)",
                    400: "hsl(218, 12%, 70%)",
                    500: "hsl(218, 10%, 55%)",
                    600: "hsl(218, 10%, 40%)",
                    700: "hsl(218, 15%, 28%)",
                    800: "hsl(219, 25%, 18%)",
                    900: "hsl(220, 30%, 10%)",
                },
            },
            fontFamily: {
                sans: ['"Poppins"', '"Inter"', 'sans-serif'],
            },
            borderRadius: {
                lg: "1rem",
                md: "calc(1rem - 2px)",
                sm: "calc(1rem - 4px)",
            },
            spacing: {
                '4': '1rem',
                '8': '2rem',
                '12': '3rem',
                '16': '4rem',
                '24': '6rem',
                '32': '8rem',
                '48': '12rem',
                '64': '16rem',
            },
            backgroundImage: {
                'gradient-1': 'linear-gradient(135deg, hsl(210, 90%, 56%) 0%, hsl(31, 95%, 58%) 100%)',
                'gradient-2': 'linear-gradient(135deg, hsl(210, 84%, 44%) 0%, hsl(31, 100%, 62%) 100%)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
