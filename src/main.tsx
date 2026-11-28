import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@/i18n";
import "@/styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthProvider.tsx";
import { LocalePreferencesProvider } from "@/context/LocalePreferencesProvider.tsx";
import { PreferencesProvider } from "@/context/PreferencesProvider.tsx";
import { ThemeProvider } from "@/context/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<Suspense fallback={null}>
				<BrowserRouter>
					<LocalePreferencesProvider>
						<PreferencesProvider>
							<AuthProvider>
								<App />
							</AuthProvider>
						</PreferencesProvider>
					</LocalePreferencesProvider>
				</BrowserRouter>
			</Suspense>
		</ThemeProvider>
	</StrictMode>,
);
