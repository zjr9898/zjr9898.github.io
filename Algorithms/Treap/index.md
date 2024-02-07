# Treap

## 预备知识
二叉查找树、堆
## 为何需要
在一些特殊的情况下，二叉查找树的复杂度会降低到线性，Treap是一个随机附加域满足堆的性质的二叉搜索树，其结构相当于以随机数据插入的二叉搜索树，Treap的特点是实现简单，且能基本实现随机平衡的结构。
## 算法概述
Treap=Tree+Heap。Treap本身是一棵二叉搜索树，它的左子树和右子树也分别是一个Treap，和一般的二叉搜索树不同的是，Treap纪录一个额外的数据，就是优先级。
存储可以通过定义一个结构体Node；为了维护它的性质，可以通过两种基本操作：分裂（Split）、合并（Merge)，当然，还有其他方法，这里就只说无旋的了。
## 算法详解
### 存储 
其实能存二叉树的都行：比如数组，指针，结构体。
这里说一下用结构体的：
```c++ 
struct Node{
	int key;
	int pri;
	int lc;
	int rc;
	int sz;
};
int tot;
int root;
```
也可以用cnt来保存相同节点个数
```c++
struct Node{
	int key;
	int pri;
	int lc;
	int rc;
	int sz;
    int cnt;//桶
};
```
两种方案都能处理有相同节点的情况。
### 分裂 Split
分裂可以将完整的一棵平衡树分裂为两棵平衡树，（其实任何树都能分裂）。
两种方法：
1.按照数值分成两颗Treap，一颗上面的值全部小于等于（或大于等于）val，另一颗相反；
2.按照size来分裂。
一般来说是采取第一种方法，在此也重点说这一种方法。
分裂后返回两个树根
#### 小技巧
定义pair<int,int>比较麻烦，可以用typedef pair<int,int> pii代替。
```c++
typedef pair<int,int> pii;
pii a;
```
这里a是个pair。
#### 递归实现
```c++
pii Split(int now,int x){
	if(!now){
		return make_pair(0,0);
	}
	if(x>=tr[now].key){
		pii tmp=Split(tr[now].rc,x);
		tr[now].rc=tmp.first;
		Update(now);
		return make_pair(now,tmp.second);
	}
	else{
		pii tmp=Split(tr[now].lc,x);
		tr[now].lc=tmp.second;
		Update(now);
		return make_pair(tmp.first,now);
	}
}
```
### 合并 Merge 
合并两个Treap：a和b，且保证a的所有节点的值小于b所有节点的值。
返回合并后共同的树根。
合并是要注意满足堆的性质。
#### 递归实现
```c++
int Merge(int u,int v){
	if(u==0){
		return v;
	}
	if(v==0){
		return u;
	}
	if(tr[u].pri>tr[v].pri){
		tr[u].rc=Merge(tr[u].rc,v);
		Update(u);
		return u;		
	}
	tr[v].lc=Merge(u,tr[v].lc);
	Update(v);
	return v;
}
```
### 新建 Add
#### 注意
不同于二叉查找树的是要给pri附个随机值
```c++
int inline Add(int x){
	++tot;
	tr[tot].key=x;
	tr[tot].pri=rand()%MAXN;//求余，防止数过大
	tr[tot].lc=tr[tot].rc=0;
	tr[tot].sz=1;
	return tot;
}
```
#### 小技巧
用inline加快运行速度。
### 插入 Insert
发现可以用前面说的两种操作实现：
1.插入的点作为一棵Treap，根是Add的返回值；
2.把原来的Treap按插入值的大小分裂成两棵树；
假设插入为x,
原树分成a,b,
这时(a的key)<=x<=(b的key);
3.先合并a,x(满足二叉查找树性质)；
4.合并结果与b合并(满足二叉查找树性质)；
```c++
void Insert(int x){
	int f=Add(x);//独自成树，调用Add();
	pii tmp=Split(root,x);//分成两树
	root=Merge(Merge(tmp.first,f),tmp.second);//合并成树
	return;
}
```
### 更新 Update
有时改变了树的size，这个函数通过两个子树计算size!
fa.size=lc.size+rc.size+1;
```c++
void inline Update(int now){
	if(!now){
		return;
	}
	tr[now].sz=tr[tr[now].lc].sz+tr[tr[now].rc].sz+1;
}
```
### 删除 Delete
比二叉查找树的删除简单多了;
把now的左子树和右子树合并;
再把得到的新树根赋给now。（因为要彻底改变now,now还作为儿子、孙子,所以要引用，这样一路下来都改了）
#### 注意
删完一定要更新
```c++
void Delete(int &now,int x){
	if(now==0){
		return;
	}
	if(x<tr[now].key){
		Delete(tr[now].lc,x);
		Update(now);
		return;
	}
	if(x>tr[now].key){
		Delete(tr[now].rc,x);
		Update(now);
		return;
	}
	now=Merge(tr[now].lc,tr[now].rc);
	return;
}
```
### 第k大 Find_kth
类似二叉查找树的
```c++
int Find_kth(int now,int k){
	if(!now){
		return false;
	}
	int tmp=tr[tr[now].lc].sz+1;
	if(k==tmp){
		return now;
	}
	if(k<tmp){
		return Find_kth(tr[now].lc,k);
	}
	return Find_kth(tr[now].rc,k-tmp);
}
```
### 询问是第几小的数 Rank
类似二叉查找树的
```c++
int Rank(int now,int x){
	if(!now){
		return -1;
	}
	if(tr[now].key==x){
		return tr[tr[now].lc].sz+1;
	}
	if(x<tr[now].key){
		return Rank(tr[now].lc,x);
	}
	int tmp=Rank(tr[now].rc,x);
	if(tmp!=-1){
		return tmp+tr[tr[now].lc].sz+1;
	}
	return -1;
}
```
### 前驱 Prev
类似二叉查找树的
```c++
int Prev(int now,int x){
	if(now==0){
		return -1;
	}
	if(x<=tr[now].key){
		return Prev(tr[now].lc,x);
	}
	else{
		int res=Prev(tr[now].rc,x);
		if(res==-1){
			return now;
		}
		else{
			return res;
		}
	}
}
```
### 后继 Next
类似二叉查找树的
```c++
int Next(int now,int x){
	if(now==0){
		return -1;
	}
	if(x>=tr[now].key){
		return Next(tr[now].rc,x);
	}
	else{
		int res=Next(tr[now].lc,x);
		if(res==-1){
			return now;
		}
		else{
			return res;
		}
	}
}
```
