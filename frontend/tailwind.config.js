export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: { 
        extend: {
            colors: {
                gradientStart: "rgba(21, 45, 87, 1)", // lighter blue
                gradientEnd: "rgba(3, 3, 28, 1)",    // dark navy
            },
            backgroundImage: {
                "radial-dark": "radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 60%)",
            },
        } 
    },
    plugins: [],
}
