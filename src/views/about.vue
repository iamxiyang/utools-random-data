<template>
  <div class="page-container about-page">
    <div class="page-header">
      <h2>关于插件</h2>
    </div>

    <div class="page-card about-card">
      <div class="about-content">
        <section class="info-section">
          <h3>插件简介</h3>
          <p>
            随机生成虚假数据插件，是一款 <strong>开源</strong>、<strong>免费</strong> 的 uTools 插件。
            旨在帮助开发和测试人员在开发阶段快速生成测试数据。
          </p>
          <p>
            内置了部分常见的生成规则，生成的内容符合特定校验规则（如身份证、手机号等），但均为 <strong>虚构数据</strong>，请勿用于非法用途。
          </p>
        </section>

                <section class="appreciation-section">
          <h3>赞赏作者</h3>
          <div class="link-cards">
            <div class="link-card appreciation-card" @click="showAppreciation = true">
              <div class="link-icon-wrapper appreciation-icon">
                <el-icon class="link-icon"><Coffee /></el-icon>
              </div>
              <div class="link-info">
                <span class="link-label">微信赞赏码</span>
                <span class="link-url">如果这个插件对你有帮助，欢迎请作者喝杯咖啡 ☕</span>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </section>
        
        <section class="links-section">
          <h3>项目链接</h3>
          <div class="link-cards">
            <div class="link-card" @click="openGithub">
              <div class="link-icon-wrapper">
                <el-icon class="link-icon"><Share /></el-icon>
              </div>
              <div class="link-info">
                <span class="link-label">GitHub 源码</span>
                <span class="link-url">iamxiyang/utools-random-data</span>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </section>


      </div>

      <!-- 赞赏码弹窗 -->
      <el-dialog v-model="showAppreciation" title="赞赏作者" width="320px" center>
        <div class="appreciation-dialog">
          <img src="/wechat-appreciation.jpg" alt="微信赞赏码" class="appreciation-qr" />
          <p class="appreciation-tip">感谢您的支持，作者会继续努力！</p>
        </div>
      </el-dialog>

      <div class="about-footer">
        <p>Made with ❤️ by <span class="author">iamxiyang</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { openUrl } from '../utils'
  import packageJson from '../../package.json'
  import { Share, ArrowRight, Coffee } from '@element-plus/icons-vue'

  const showAppreciation = ref(false)
  const openGithub = () => openUrl('https://github.com/iamxiyang/utools-random-data')
</script>

<style scoped lang="scss">
  .about-page {
    max-width: 800px;
  }

  .about-card {
    padding: 0;
    overflow: hidden;
  }


  .about-content {
    padding: 24px;

    section {
      margin-bottom: 24px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 16px;
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;

        &::before {
          content: '';
          width: 4px;
          height: 18px;
          background: var(--el-color-primary);
          border-radius: 2px;
          margin-right: 10px;
        }
      }

      p {
        font-size: 15px;
        line-height: 1.8;
        color: var(--el-text-color-regular);
        margin: 0 0 12px;
      }
    }
  }

  .link-cards {
    .link-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        transform: translateY(-1px);

        .link-icon-wrapper {
          background: var(--el-color-primary);
          color: white;
        }

        .arrow-icon {
          transform: translateX(4px);
          color: var(--el-color-primary);
        }
      }

      .link-icon-wrapper {
        width: 40px;
        height: 40px;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        margin-right: 16px;

        .link-icon {
          font-size: 20px;
        }
      }

      .link-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .link-label {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .link-url {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }

      .arrow-icon {
        font-size: 18px;
        color: var(--el-text-color-placeholder);
        transition: all 0.3s;
      }
    }
  }

  .about-footer {
    padding: 16px;
    text-align: center;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-lighter);

    p {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    .author {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  /* 赞赏部分 */
  .appreciation-section {
    .appreciation-hint {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      margin-bottom: 12px;
    }
    
    .appreciation-card {
      .appreciation-icon {
        background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%);
        color: white;
      }
      
      &:hover {
        .appreciation-icon {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        }
      }
    }
  }

  /* 赞赏弹窗 */
  .appreciation-dialog {
    text-align: center;
    padding: 8px 0;
    
    .appreciation-qr {
      width: 220px;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .appreciation-tip {
      margin: 16px 0 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
