<template>
	<div class="Pagination">
    <el-pagination ref="pagination" background :layout="layout" :page-size="pageSize" :total="total" :current-page="currentPage"
     @current-change="currentChange" @size-change="handleSizeChange" :page-sizes="pageSizes">
    </el-pagination>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				currentChanges:0,
			};
		},
		props: {
			pageSizes: {
				type: Array,
				default: function() {
					return [10, 20, 30, 40];
				}
			},
			pageSize: {
				type: Number,
				default: 10
			},
			total: {
				type: Number,
				default: 100
			},
			currentPage: {
				type: Number,
				default: 1
			},
			layout: {
				type: String,
				default: 'total, sizes, prev, pager, next, jumper'
			}
		},
		methods: {
			handleSizeChange(e) {
				this.$emit('handleSizeChange', e);
			},
			arrowLeft() {
				this.$refs.pagination.internalCurrentPage = 1;
				this.$emit('currentChange', 1);
			},
			arrowRifht() {
				this.currentChanges=parseInt(this.total / this.pageSize);
				if(this.total % this.pageSize>0){
					this.currentChanges++;
				}
				this.$refs.pagination.internalCurrentPage =this.currentChanges;
				this.$emit('currentChange', this.currentChanges);
			},
			currentChange(pageIndex) {
				this.$emit('currentChange', pageIndex);
			}
		}
	};
</script>

<style lang="scss">
	.Pagination {
		margin: 20px 0px 20px 0px;
		display: flex;
		justify-content: flex-end;
	}
</style>
