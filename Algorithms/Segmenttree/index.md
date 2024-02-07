## 概述
线段树类的问题常常会有区间更新的操作，如果用单点更新，复杂度是 O(nlogn)的，不可取。
懒操作可以让区间更新问题变得更快。
## 例
一棵线段树

 ![屏幕截图 2023-01-10 194444.png](/web.RequireFile.do?fid=5Jr9RzBg)

把2-7的每个元素+1，需要更新的如下图

![Inked屏幕截图 2023-01-10 194444.jpg](/web.RequireFile.do?fid=DrpXIHqS)

整棵树几乎“全军覆没”了。

所以我们不必全改，要“懒”一点，只改第一个被查询区间包含的节点

![Inked屏幕截图 2023-01-10 194444.jpg](/web.RequireFile.do?fid=a3MgBymP)

这样明显好多了
## 实现
但是祖先们还欠了后代们一笔账，只更新了自己，后代们未更新。这笔账自然要记，可以在Node中添加一个lazy，好比一个帐本
```c++
truct Node{
	int l,r;
	LL lz,min,max,sum;
}
```
查询和更新不同于没有懒操作的地方在于需要在查询孩子之前把欠孩子的账先还了，否则必然出错
好比把账推下去，实现如下
```c++
inline void Lazy(int n,int v){
	tr[n].lz+=v;
	tr[n].min+=v;
	return;
}
inline void Pushdown(int n){
	Lazy(lc,tr[n].lz);
	Lazy(rc,tr[n].lz);
	tr[n].lz=false;
	return;
}
```
记得父亲的账还清了，所以 tr[n].lz=false; 。

是不是有些麻烦？
但是不这么做是很慢的。

## 技巧
经常需要算左子、右子和中点，可用宏定义
```c++
#define lc n<<1
#define rc (n<<1)+1
#define mid (l+r)/2
```
可以理解为把程序中的 lc 替换成 n<<1; rc 替换成 (n<<1)+1; mid 替换成 (l+r)/2
但要小心重复定义重复
## 注意
线段树是完全二叉树
所以要
```c++
tr[MAXN*4];
```
## 代码
实现
　　(1)数列中某连续一段全部+1
　　(2)求数列中某连续一段的最小值，并输出这个值
核心部位
```c++
inline void Upd(int n){
	tr[n].min=min(tr[lc].min,tr[rc].min);
	return;
}
inline void Lazy(int n,int v){
	tr[n].lz+=v;
	tr[n].min+=v;
	return;
}
inline void Pushdown(int n){
	Lazy(lc,tr[n].lz);
	Lazy(rc,tr[n].lz);
	tr[n].lz=false;
	return;
}
void Build(int n,int l,int r){
	tr[n].l=l;
	tr[n].r=r;
	if(l==r){
		tr[n].min=a[l];
		return;
	}
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	Upd(n);
	return;
}
LL Query(int n,int l,int r){
	if(tr[n].l>=l&&tr[n].r<=r){
		return tr[n].min;
	}
	Pushdown(n);
	int m=(tr[n].l+tr[n].r)>>1;
	if(r<=m){
		return Query(lc,l,r);
	}
	else if(l>m){
		return Query(rc,l,r);
	}
	else{
		return min(Query(lc,l,r),Query(rc,l,r));
	}
}
void Update(int n,int l,int r,int v){
	if(tr[n].l>=l&&tr[n].r<=r){
		tr[n].min+=v;
		tr[n].lz+=v;
		return;
	}
	Pushdown(n);
	int m=(tr[n].l+tr[n].r)>>1;
	if(l<=m){
		Update(lc,l,r,v);
	}
	if(r>m){
		Update(rc,l,r,v);
	}
	Upd(n);
	return;
}
```
