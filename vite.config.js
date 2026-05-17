import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                start: resolve(__dirname, "index.html"),
                guestbooking: resolve(__dirname, "guestbooking.html"),
                menu: resolve(__dirname, "menu.html"),
                employeelogin: resolve(__dirname, "employeelogin.html"),
                employeebooking: resolve(__dirname, "employeebooking.html")
            }
        }
    },
    css: {
        devSourcemap: true
    }
});