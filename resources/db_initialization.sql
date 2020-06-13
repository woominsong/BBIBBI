CREATE TABLE bbibbi_db.accounts (
id VARCHAR(45) PRIMARY KEY,
addr INT UNIQUE,
password VARCHAR(60) NOT NULL,
name VARCHAR(45),
salt VARCHAR(30),
prof_img INT
);

CREATE TABLE bbibbi_db.friends (
my_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
friend_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
chatroom_id INT,
PRIMARY KEY (my_id, friend_id)
);

CREATE TABLE bbibbi_db.chats (
chatroom_id INT,
chat_id INT,
send_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
content BIGINT
);

CREATE TABLE bbibbi_db.chatrooms (
chatroom_id INT PRIMARY KEY,
p1_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
p2_id VARCHAR(45) REFERENCES bbibbi_db.accounts(id),
latest_chat BIGINT,
latest_chat_id INT
);

CREATE TABLE bbibbi_db.dictionary (
code INT PRIMARY KEY,
explanation VARCHAR(100)
); 