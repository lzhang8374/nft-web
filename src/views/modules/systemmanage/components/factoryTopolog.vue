<template>
	<div class="factoryTopolog-container">
		<div class="factoryTopolog-box">
      <vue2-org-tree :data="topologInfo"/>
		</div>
	</div>
</template>

<script>
	export default {
    props:{
      topologInfo:{
        type:Object
      }
    },
		data() {
			return {
        topologList:{}
			};
		},
		created() {
			this.init()
		},
		methods: {
			//初始化
			init(){
			},
		}
	};
</script>

<style lang="less">
  @import './less/org-tree.less';
	.factoryTopolog-box {
		background-color: #ffffff;
		width: 100%;
		padding-top: 0px 10px;
	}

	.factoryTopolog-container {
		height: 100%;
		display: flex;
		background-color: #FFFFFF;
		margin-right: 20px;
	}
</style>
