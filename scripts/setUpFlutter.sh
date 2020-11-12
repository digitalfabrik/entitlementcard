cd frontend
git clone https://github.com/flutter/flutter.git -b stable
./flutter/bin/flutter doctor

openssl aes-256-cbc -K $encrypted_fb088dcee1f3_key -iv $encrypted_fb088dcee1f3_iv -in secrets.json.enc -out secrets.json -d
