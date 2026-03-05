一个快读快写板子，支持读入int范围的正整数，可以用来卡常。

```cpp
char *p1,*p2,buf[100000];
#define nc() (p1==p2 && (p2=(p1=buf)+fread(buf,1,100000,stdin),p1==p2)?EOF:*p1++)
int read()
{
    int x=0,f=1;
    char ch=nc();
    while(ch<48||ch>57)
    {
        ch=nc();
    }
    while(ch>=48&&ch<=57)
        x=x*10+ch-48,ch=nc();
   	return x*f;
}
void write(int x)
{
    if(x>9)
        write(x/10);
    putchar(x%10+'0');
    return;
}
```
