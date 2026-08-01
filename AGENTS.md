<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy
When deploying with rsync, ALWAYS exclude content/, public/images/, and *.db* to avoid overwriting admin-created data:
```
rsync -avz --delete --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'content/' --exclude 'public/images/' --exclude '*.db*' -e "ssh -i /home/prasun/Downloads/fishybizness.pem" /home/prasun/AI/fishybizness/ ubuntu@3.111.21.1:/home/ubuntu/fishybizness/
```
