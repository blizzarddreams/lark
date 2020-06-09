FROM nikolaik/python-nodejs:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

RUN pipenv lock -r >> requirements.txt

RUN pip install -r requirements.txt

RUN npm run build

CMD gunicorn lark.wsgi