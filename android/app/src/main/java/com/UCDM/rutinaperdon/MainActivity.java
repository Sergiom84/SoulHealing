package com.UCDM.rutinaperdon;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1) Habilita debugging remoto de WebView
        WebView.setWebContentsDebuggingEnabled(true);

        // 2) Obtén el WebView que gestiona Capacitor internamente
        WebView webView = null;
        try {
            webView = (WebView) getBridge().getWebView().getView();
        } catch (Exception e) {
            // Seguridad: evita crash si no está disponible aún
            e.printStackTrace();
        }

        if (webView != null) {
            // 3) Permitir mixed content (HTTP dentro de HTTPS)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                webView.getSettings().setMixedContentMode(
                        WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                );
            }

            // 4) Ajustes de seguridad y rendimiento
            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setJavaScriptEnabled(true);
        }
    }
}
