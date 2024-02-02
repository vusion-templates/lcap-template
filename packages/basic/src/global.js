// 用来mock Vue的构造函数
function GlobalFn() {}

GlobalFn.prototype.set = function() {

};
GlobalFn.prototype.$set = function () {

};
GlobalFn.prototype.delete = function () {
  
};

export default GlobalFn;