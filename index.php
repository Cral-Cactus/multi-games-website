<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi Games Website</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .game-frame {
            width: 100%;
            height: 100%;
            border: none;
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
        }
        .close-button {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            display: none;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f44336;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <header>
        <h1>Games Gallery</h1>
    </header>
    <main>
        <div class="card-container">
            <?php
                $gameDirectories = array_filter(glob('*'), 'is_dir');
                if (empty($gameDirectories)) {
                    echo '<p>No games found in the directory.</p>';
                } else {
                    foreach ($gameDirectories as $gameDir) {
                        $gameTitle = ucfirst($gameDir);
                        $gameHTML = $gameDir . '/' . $gameDir . '.html';

                        if (file_exists($gameHTML)) {
                            echo '<div class="card">';
                            echo '<div class="card-content">';
                            echo '<h2>' . $gameTitle . '</h2>';
                            echo '<p>Description of ' . $gameTitle . '.</p>';
                            echo '<button onclick="loadGame(\'' . $gameHTML . '\')">Play Now</button>';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                }
            ?>
        </div>
        <iframe id="game-frame" class="game-frame"></iframe>
        <button id="close-button" class="close-button" onclick="closeGame()">Close Game</button>
    </main>
    <script>
        function loadGame(gameUrl) {
            var gameFrame = document.getElementById('game-frame');
            var closeButton = document.getElementById('close-button');
            gameFrame.src = gameUrl;
            gameFrame.style.display = 'block';
            closeButton.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeGame() {
            var gameFrame = document.getElementById('game-frame');
            var closeButton = document.getElementById('close-button');
            gameFrame.src = '';
            gameFrame.style.display = 'none';
            closeButton.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    </script>
</body>
</html>