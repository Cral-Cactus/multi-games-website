<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi Games Website</title>
    <link rel="stylesheet" href="style.css">
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
    <script src="script.js"></script>
</body>
</html>