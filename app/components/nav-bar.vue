<template>
  <div class="nav-bar">
    <hamburger v-if="isMobile" :is-active="appStore.sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <div v-if="isMobile" class="layout-logo">
      <img src="@/assets/images/logo/logo.webp" class="logo" />
    </div>

    <Sidebar v-if="!isMobile" class="sidebar" />

    <div class="right-menu">
      <!-- <LocaleDropdown class="right-menu-item" /> -->
      <div class="right-menu-item user">
        <el-avatar :icon="UserFilled" :size="30" />
        <span>{{ userStore.username }} aa</span>
      </div>
    </div>
    <!-- <el-dropdown class="user-name">
      <div class="right-menu-item user">
        <el-avatar :icon="UserFilled" :size="30" />
        <span>{{ userStore.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided @click="toPage('/my-profile')"> {{ t("router.my_profile") }} </el-dropdown-item>
          <el-dropdown-item divided @click="logout"> {{ t("logout") }} </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
  </div>
</template>

<script lang="ts" setup>
import { UserFilled } from "@element-plus/icons-vue";
// import { useAppStore } from "@/stores/app";
// import { useUserStore } from "@/stores/user";

const { isMobile } = useDevice();
const appStore = useAppStore();
const userStore = useUserStore();

function toggleSidebar() {
  appStore.toggleSidebar(false);
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: var(--navbar-height);
  overflow: hidden;
  background: var(--header-bg-color);
  display: flex;
  justify-content: space-between;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    flex: 1;
    @media screen and (max-width: 576px) {
      display: none;
    }
  }
  .sidebar {
    flex: 1;
    min-width: 0px;

    :deep(.el-menu) {
      background-color: transparent;
    }
    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-menu-active-color) !important;
        }
      }
    }
  }
  .right-menu {
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;

    &-item {
      margin: 0 10px;
      cursor: pointer;
      &:last-child {
        margin-left: 20px;
      }
    }

    .user {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
      }
      span {
        font-size: 16px;
      }
    }
  }
}

.layout-logo {
  display: flex;
  align-items: center;
  height: 100%;
  // width: 100%;

  .logo {
    // width: 26px;
    height: 46px;
  }
}
</style>
