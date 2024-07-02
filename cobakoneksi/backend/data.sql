create database gamestore;

use gamestore;

drop table games;

create table games (
    `id` int(11) not null primary key,
    `title` varchar(255),
    `image` varchar(255),
    `price` int
);

insert into games(`id`,`title`,`image`,`price`) values (1,"EA sports fc 24","https://image.api.playstation.com/vulcan/ap/rnd/202309/1120/e9ae5df6e2f90c0a43cf78639f8a53f1b9afcc511903cde2.png",79000);
insert into games(`id`,`title`,`image`,`price`) values (2,"Ghostwire Tokyo","https://upload.wikimedia.org/wikipedia/en/d/d9/Ghostwire_Tokyo.png",179000);