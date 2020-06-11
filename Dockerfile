FROM python:3.8.3-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install -y nodejs

RUN npm install

COPY . .

EXPOSE 8000

RUN pip install pipenv

RUN pipenv lock -r >> requirements.txt

RUN pip install -r requirements.txt

RUN npm run build

RUN npm run webpack

CMD gunicorn lark.wsgi