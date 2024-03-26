rsync -avz --delete \
--exclude ".git" \
--exclude "vendor" \
--exclude ".idea" \
--exclude ".DS_Store" \
--exclude "deploy.me.sh" \
--exclude "config.core.php" \
--exclude "node_modules" \
./ me:/www/pkgs/monaco/