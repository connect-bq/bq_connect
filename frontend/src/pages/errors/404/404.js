

tailwind.config = {
    theme: {
        extend: {
            colors: {
                'orange-primary': '#FF6B35',
                'orange-soft': '#FF8A65',
                'orange-dark': '#E55A2B',
                'gray-dark': '#333333',
                'gray-medium': '#666666',
                'gray-light': '#999999',
                'gray-bg': '#F0F0F0'
            },
            fontFamily: {
                'work': ['Work Sans', 'system-ui', 'sans-serif']
            },
            animation: {
                'fade-up': 'fadeUp 0.8s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite alternate',
                'float': 'float 8s ease-in-out infinite',
                'shine': 'shine 3s ease-in-out infinite'
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                pulseSoft: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.05)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '25%': { transform: 'translateY(-15px) rotate(5deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(-5deg)' },
                    '75%': { transform: 'translateY(-20px) rotate(3deg)' }
                },
                shine: {
                    '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
                    '50%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
                    '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' }
                }
            }
        }
    }
}