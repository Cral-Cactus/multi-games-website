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
                        //$gameImage = $gameDir . '/' . $gameDir . '.jpg'; // Assuming each game folder has an image named the same as the folder
                        $gameHTML = $gameDir . '/' . $gameDir . '.html'; // Link to the game's HTML file

                        //if (file_exists($gameImage) && file_exists($gameHTML)) {
                        if (file_exists($gameHTML)) {
                            echo '<div class="card">';
                            //echo '<img src="' . $gameImage . '" alt="' . $gameTitle . '">';
                            echo '<div class="card-content">';
                            echo '<h2>' . $gameTitle . '</h2>';
                            echo '<p>Description of ' . $gameTitle . '.</p>';
                            echo '<button onclick="window.location.href=\'' . $gameHTML . '\'">Play Now</button>';
                            echo '</div>';
                            echo '</div>';
                        } else {
                            //echo '<p>Missing files for ' . $gameTitle . '. Ensure both ' . $gameDir . '/' . $gameDir . '.jpg and ' . $gameDir . '/' . $gameDir . '.html exist.</p>';
                        }
                    }
                }
            ?>
        </div>
    </main>
</body>
</html>