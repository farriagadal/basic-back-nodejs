FROM mysql

RUN mysql -uroot -p"keydev" && mysql create database test;