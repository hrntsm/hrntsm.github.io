# -*- coding: utf-8 -*-
from stop_watch import stop_watch


@stop_watch
def par_write(count):
    with open("par_write.txt", mode="w") as f:
        for i in range(count):
            f.write("{}\n".format(str(i)))


@stop_watch
def once_write(count):
    with open("once_write.txt", mode="w") as f:
        s = ""
        for i in range(count):
            s += "{}\n".format(str(i))
        f.write(str(s))


count = 2000000
par_write(count)
once_write(count)
