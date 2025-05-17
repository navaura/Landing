
(function() {
    // Create the stylesheet
    const style = document.createElement('style');
    style.textContent = `
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #222222;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10000;
            border-top: 1px solid #333333;
            animation: cookieSlideUp 0.5s ease-out;
            font-family: Arial, sans-serif;
        }
        
        .cookie-content {
            flex: 1;
            margin-right: 20px;
        }
        
        .cookie-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 16px;
            color: #ffffff;
        }
        
        .cookie-text {
            font-size: 14px;
            color: #cccccc;
            line-height: 1.4;
        }
        
        .cookie-btn {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            font-weight: 500;
            transition: all 0.2s ease;
            background-color: #444444;
            color: white;
        }
        
        .cookie-btn:hover {
            background-color: #666666;
        }
        
        @keyframes cookieSlideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Check if the user has already accepted cookies
    function hasAcceptedCookies() {
        return document.cookie.split(';').some((item) => item.trim().startsWith('cookiesAccepted='));
    }

    // Create and show the cookie banner if not already accepted
    function createCookieBanner() {
        // Don't show if already accepted
        if (hasAcceptedCookies()) {
            return;
        }

        // Create banner elements
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookie-banner';

        const content = document.createElement('div');
        content.className = 'cookie-content';

        const title = document.createElement('div');
        title.className = 'cookie-title';
        title.textContent = 'We use cookies';

        const text = document.createElement('div');
        text.className = 'cookie-text';
        text.textContent = 'By continuing to browse our site, you are agreeing to our use of cookies to enhance your experience and provide personalized content.';

        const button = document.createElement('button');
        button.className = 'cookie-btn';
        button.textContent = 'OK';
        button.onclick = acceptCookies;

        // Assemble banner
        content.appendChild(title);
        content.appendChild(text);
        banner.appendChild(content);
        banner.appendChild(button);

        // Add to document
        document.body.appendChild(banner);
    }

    // Handle cookie acceptance
    function acceptCookies() {
        // Hide the cookie banner
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
        
        // Set a cookie to remember acceptance for 1 year
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = "cookiesAccepted=true; expires=" + expiryDate.toUTCString() + "; path=/; SameSite=Lax";
        
        console.log("Cookies accepted");
    }

    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCookieBanner);
    } else {
        createCookieBanner();
    }
})();
