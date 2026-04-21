package com.krishishield.emulator

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import com.krishishield.emulator.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1001
    }

    private lateinit var binding: ActivityMainBinding
    private lateinit var assetLoader: WebViewAssetLoader
    private var geolocationCallback: GeolocationPermissions.Callback? = null
    private var geolocationOrigin: String? = null
    private var pageLoaded = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        requestLocationPermissionIfNeeded()

        binding.retryButton.setOnClickListener {
            loadApp()
        }

        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler(
                "/",
                WebViewAssetLoader.AssetsPathHandler(this)
            )
            .build()

        with(binding.webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            setGeolocationEnabled(true)
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            loadsImagesAutomatically = true
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            useWideViewPort = true
            loadWithOverviewMode = false
            builtInZoomControls = false
            displayZoomControls = false
            setSupportZoom(false)
            textZoom = 100
            layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL
        }
        binding.webView.setPadding(0, 0, 0, 0)
        binding.webView.isVerticalScrollBarEnabled = false
        binding.webView.isHorizontalScrollBarEnabled = false

        binding.webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val url = request?.url ?: return null
                return assetLoader.shouldInterceptRequest(url)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                pageLoaded = false
                showLoading()
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                pageLoaded = true
                showWebView()
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (request?.isForMainFrame == true) {
                    showError(
                        "Cannot open the app",
                        "The packaged app files could not be loaded. Rebuild the web app bundle and try again."
                    )
                }
            }

            override fun onReceivedHttpError(
                view: WebView?,
                request: WebResourceRequest?,
                errorResponse: WebResourceResponse?
            ) {
                if (request?.isForMainFrame == true) {
                    showError(
                        "App page failed to load",
                        "The packaged app returned an unexpected response."
                    )
                }
            }
        }

        binding.webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }

            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        if (savedInstanceState == null) {
            loadApp()
        } else {
            binding.webView.restoreState(savedInstanceState)
            if (pageLoaded) showWebView() else showLoading()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.webView.saveState(outState)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode != LOCATION_PERMISSION_REQUEST_CODE) return

        val granted = grantResults.any { it == PackageManager.PERMISSION_GRANTED }
        geolocationCallback?.invoke(geolocationOrigin, granted, false)
        geolocationCallback = null
        geolocationOrigin = null
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (binding.webView.canGoBack()) {
            binding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    private fun hasLocationPermission(): Boolean {
        val fineGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarseGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        return fineGranted || coarseGranted
    }

    private fun requestLocationPermissionIfNeeded() {
        if (hasLocationPermission()) return

        val finePermanentlyDenied = !ActivityCompat.shouldShowRequestPermissionRationale(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
        val coarsePermanentlyDenied = !ActivityCompat.shouldShowRequestPermissionRationale(
            this,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (finePermanentlyDenied && coarsePermanentlyDenied) {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            intent.data = Uri.parse("package:" + packageName)
            startActivity(intent)
            return
        }

        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ),
            LOCATION_PERMISSION_REQUEST_CODE
        )
    }

    private fun loadApp() {
        showLoading()
        binding.webView.loadUrl(BuildConfig.WEB_APP_URL)
    }

    private fun showLoading() {
        binding.statusOverlay.visibility = View.VISIBLE
        binding.loadingSpinner.visibility = View.VISIBLE
        binding.retryButton.visibility = View.GONE
        binding.statusTitle.text = "Opening KrishiShield AI"
        binding.statusMessage.text = "Loading the packaged app build"
    }

    private fun showError(title: String, message: String) {
        binding.statusOverlay.visibility = View.VISIBLE
        binding.loadingSpinner.visibility = View.GONE
        binding.retryButton.visibility = View.VISIBLE
        binding.statusTitle.text = title
        binding.statusMessage.text = message
    }

    private fun showWebView() {
        binding.statusOverlay.visibility = View.GONE
        binding.loadingSpinner.visibility = View.GONE
        binding.retryButton.visibility = View.GONE
    }
}
