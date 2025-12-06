<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Arcade — Login</title>
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="login-arcade-body">
    <div class="arcade-scene">
        <div class="login-stage">
            <div class="pixel-nav shadow-arcade">
                <div class="nav-title">Student Arcade</div>
                <div class="nav-ornament" aria-hidden="true">
                    <span class="dot pink"></span>
                    <span class="dot mint"></span>
                    <span class="dot cyan"></span>
                </div>
            </div>

            <div class="login-shell">
                <div class="panel-slab shadow-arcade">
                    <div class="panel-inner crt-overlay">
                        <h3 class="section-label">Player Sign-in</h3>
                        <p class="login-heading">Welcome Back</p>
                        <p class="login-subtitle">Enter your credentials</p>

                        <form method="POST" action="{{ route('login') }}" class="arcade-form">
                            @csrf
                            <div>
                                <label for="email" class="arcade-label">Player Email</label>
                                <input id="email" type="email" name="email" required placeholder="player@arcade.edu" class="glass-input" />
                            </div>

                            <div>
                                <label for="password" class="arcade-label">Password</label>
                                <input id="password" type="password" name="password" required placeholder="••••••••" class="glass-input" />
                            </div>

                            <div class="arcade-links">
                                <a href="{{ route('password.request') }}">Forgot password?</a>
                                <a href="{{ route('register') }}">Create player</a>
                            </div>

                            <div class="press-buttons single">
                                <button type="submit" class="press-btn start shadow-arcade">Sign In</button>
                            </div>
                        </form>

                        <p class="microtext">Tip: equip your profile to unlock mint tokens.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
