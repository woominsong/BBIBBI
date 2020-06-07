CREATE TABLE bbibbi_db.accounts (
id VARCHAR(45),
addr INT,
password VARCHAR(45) NOT NULL,
name VARCHAR(45),
PRIMARY KEY (id),
UNIQUE (addr)
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