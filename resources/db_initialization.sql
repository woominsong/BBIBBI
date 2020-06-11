CREATE TABLE bbibbi_db.accounts (
id VARCHAR(45) PRIMARY KEY,
addr INT UNIQUE,
password VARCHAR(60) NOT NULL,
name VARCHAR(45),
salt VARCHAR(30)
);

CREATE TABLE bbibbi_db.friends (
my_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
friend_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
PRIMARY KEY (my_id, friend_id)
);

CREATE TABLE bbibbi_db.chats (
from_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
to_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
sent_at DATETIME,
content INT
);

CREATE TABLE bbibbi_db.dictionary (
code INT PRIMARY KEY,
explanation VARCHAR(100)
); 