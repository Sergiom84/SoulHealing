package com.UCDM.rutinaperdon;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Si quieres personalizar la configuración del WebView
        WebView webView = (WebView) findViewById(com.getcapacitor.android.R.id.webview);
        if (webView != null) {
            WebSettings webSettings = webView.getSettings();

            // Permitir almacenamiento local (importantísimo para apps PWA)
            webSettings.setDomStorageEnabled(true);

            // Permitir acceso a archivos locales
            webSettings.setAllowFileAccess(true);
            webSettings.setAllowContentAccess(true);

            // Permitir contenido mixto (HTTP dentro de HTTPS) — necesario si usas recursos HTTP
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

            // Si usas alguna funcionalidad de cookies
            // android.webkit.CookieManager.getInstance().setAcceptCookie(true);
        }
    }
}
