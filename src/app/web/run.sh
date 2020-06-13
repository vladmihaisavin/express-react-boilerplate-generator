docker build --tag express-react-boilerplate .
docker run -p 3000:3000 -p 6606:6606 --name=erb -d  express-react-boilerplate