import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { provideHttpClient } from "@angular/common/http"
import { App } from "./app/app.component"
import { routes } from "./app/app-routing.module"

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideHttpClient()],
}).catch((err) => console.error(err))
