<template>
	<view class="container">
		<view class="wechatapp">
			<view class="header"></view>
		</view>
		<view class="auth-title">申请获取以下权限</view>
		<view>
			<view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
			<view class="login-btn">
				<button class="button btn-normal" @click.stop="doLogin">授权登录</button>
			</view>
		</view>
		<view class="no-login-btn">
			<button class="button btn-normal" @click="handleCancel">暂不登录</button>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as LoginApi from '@/api/login'
	export default {
		data() {
			return {
				code: ''
			}
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onLoad(options) {
			if (options.code) {
				this.code = options.code;
			} else {
				this.code = this.getQueryVariable('code');
			}
		},

		methods: {
			doLogin() {
				const app = this;
				if (!app.code) {
					app.$toast("抱歉，授权失败，未获取到认证code信息！");
					return false;
				}
				LoginApi.wxLogin(app.code).then(result => {
					app.$toast(result.message);
					app.$navTo('pages/user/index');
				})
			},
			getQueryVariable(variable) {
				const query = window.location.search.substring(1);
				const vars = query.split("&");
				for (let i = 0; i < vars.length; i++) {
					let pair = vars[i].split("=");
					if (pair[0] == variable) {
						return pair[1];
					}
				}
				return (false);
			},
			handleCancel() {
				store.dispatch('Logout');
				this.$navTo('pages/user/index');
			},
			onNavigateBack(delta = 1) {
				uni.navigateBack({
					delta: Number(delta)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 60rpx;
		font-size: 32rpx;
		background: #fff;
		min-height: 100vh;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;

		.header {
			width: 190rpx;
			height: 190rpx;
			border: 4rpx solid #fff;
			margin: 0 auto 0;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 2rpx 0 10rpx rgba(50, 50, 50, 0.3);
		}
	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.login-btn {
		padding: 0 20rpx;

		.button {
			height: 88rpx;
			line-height: 88rpx;
			background: $lego-theme;
			color: #fff;
			font-size: 30rpx;
			border-radius: 12rpx;
			text-align: center;
		}
	}

	.no-login-btn {
		margin-top: 24rpx;
		padding: 0 20rpx;

		.button {
			height: 88rpx;
			line-height: 88rpx;
			background: #dfdfdf;
			color: #fff;
			font-size: 30rpx;
			border-radius: 12rpx;
			text-align: center;
		}
	}
</style>