import request from '@/config/axios'
import { getRefreshToken } from '@/utils/auth'
import type { UserLoginVO } from './types'

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// 登录
export const login = (data: UserLoginVO) => {
  return request.post({ url: '/system/auth/login', data })
}

// 刷新访问令牌
export const refreshToken = () => {
  return request.post({ url: '/system/auth/refresh-token?refreshToken=' + getRefreshToken() })
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string) => {
  return request.get({ url: '/system/tenant/get-id-by-name?name=' + name })
}

// 登出
export const loginOut = () => {
  return request.post({ url: '/system/auth/logout' })
}

// 获取用户权限信息
export const getInfo = () => {
  return request.get({ url: '/system/auth/get-permission-info' })
}

// 路由
export const getAsyncRoutes = () => {
  // 根据这个路由初始化 system_menu
  return [
    {
      parentId: 0,
      name: '资源管理',
      path: '/resource',
      icon: 'ep:folder',
      children: [
        {
          name: '应用管理',
          path: 'app',
          component: 'resource/app/index',
          componentName: null,
          icon: 'ep:goods',
          children: null
        },
        {
          name: 'agent管理',
          path: 'agent',
          component: 'resource/agent/index',
          componentName: null,
          icon: 'ep:coin',
          children: null
        },
        {
          name: '服务管理',
          path: 'project',
          component: 'resource/project/index',
          componentName: null,
          icon: 'ep:refrigerator',
          children: null
        },
        {
          name: '编辑服务详情',
          path: 'project-detail/:id',
          component: 'resource/project/detail',
          componentName: null,
          icon: 'ep:edit',
          visible: false,
          keepAlive: true,
          alwaysShow: false,
          children: null
        }
      ]
    },
    {
      parentId: 0,
      name: '部署管理',
      path: '/deploy',
      icon: 'ep:mostly-cloudy',
      children: [
        {
          name: '部署任务',
          path: 'task',
          component: 'deploy/task/index',
          componentName: null,
          icon: 'ep:data-line',
          children: null
        },
        {
          name: '批量部署任务',
          path: 'batch-task',
          component: 'deploy/batch-task/index',
          componentName: null,
          icon: 'ep:data-analysis',
          children: null
        },
        {
          name: '新建批量部署任务',
          path: 'batch-task/create',
          component: 'deploy/batch-task/create',
          componentName: null,
          icon: 'ep:plus',
          visible: false,
          keepAlive: true,
          alwaysShow: false,
          children: null
        }
      ]
    },
    {
      parentId: 0,
      name: '系统管理',
      path: '/system',
      icon: 'ep:tools',
      children: [
        {
          name: '用户管理',
          path: 'user',
          component: 'system/user/index',
          icon: 'ep:avatar',
          children: null
        },
        {
          name: '角色管理',
          path: 'role',
          component: 'system/role/index',
          icon: 'ep:user-filled',
          children: null
        },
        {
          name: '菜单管理',
          path: 'menu',
          component: 'system/menu/index',
          icon: 'ep:grid',
          children: null
        },
        {
          name: '字典管理',
          path: 'dict',
          component: 'system/dict/index',
          icon: 'ep:list',
          children: null
        },
        {
          name: '通知公告',
          path: 'notice',
          component: 'system/notice/index',
          icon: 'ep:bell-filled',
          children: null
        }
      ]
    },
    {
      parentId: 0,
      name: '基础设施',
      path: '/infra',
      icon: 'ep:monitor',
      children: [
        {
          name: '文件配置',
          path: 'file-condig',
          component: 'infra/fileConfig/index',
          icon: 'ep:files',
          children: null
        },
        {
          name: '文件管理',
          path: 'file',
          component: 'infra/file/index',
          icon: 'ep:upload',
          children: null
        }
      ]
    }
  ]
  // return request.get({ url: '/system/auth/list-menus' })
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data })
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data })
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
// 获取验证图片以及 token
export const getCode = (data) => {
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheck = (data) => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}
