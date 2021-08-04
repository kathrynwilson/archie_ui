/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
import blank          from '@/components/atoms/a.blank'
import purchased      from '@/components/pages/p.my-data.purchased'
import notFound       from '@/components/atoms/a.error.404'
import login          from '@/components/organisms/o.form.login'
import register       from '@/components/organisms/o.form.register'
import admin          from '@/components/pages/p.admin'
import groups         from '@/components/pages/p.admin.groups'
import settings       from '@/components/pages/p.admin.settings.container'
import userManagement from '@/components/pages/p.admin.users'
import dashboard      from '@/components/pages/p.dashboard'
import explore        from '@/components/pages/p.explore'
import myData         from '@/components/pages/p.my-data'
import filesImported  from '@/components/pages/p.my-data.imported'
import stream         from '@/components/pages/p.my-data.stream'
import selfService    from '@/components/pages/p.self-service'
import audience       from '@/components/pages/p.self-service.audiences'

// import tester         from '@/components/atoms/tester'

// const routeTester = {
//   path:      `/tester`,
//   name:      `tester`,
//   component: tester,
//   meta:      {
//     title: `Tester`,
//     icon:  `mdi-alert-circle`,
//     isNav: false
//   }
// }

const routeHome = {
  path:     `/`,
  redirect: `/dashboard`,
  meta:     {
    icon:  ``,
    isNav: false
  }
}

const routeNotFound = {
  path:      `*`,
  name:      `notFound`,
  component: notFound,
  meta:      {
    title: `404`,
    icon:  `mdi-alert-circle`,
    isNav: false
  }
}

// const routeAdminApi = {
//   path:      `api`,
//   name:      `api`,
//   component: blank,
//   meta:      {
//     title:      `API`,
//     icon:       `mdi-circle-small`,
//     isNav:      true,
//     middleware: auth
//   }
// }

// const routeAdminPermissions = {
//   path:      `permissions`,
//   name:      `permissions`,
//   component: blank,
//   meta:      {
//     title:      `Permissions`,
//     icon:       `mdi-circle-small`,
//     isNav:      true,
//     middleware: auth
//   }
// }

const routeAdminSettings = {
  path:      `settings`,
  name:      `settings`,
  component: settings,
  meta:      {
    title:      `Settings`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeAdminUsers = {
  path:      `users`,
  name:      `users`,
  component: userManagement,
  meta:      {
    title:      `Users`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeAdminGroups = {
  path:      `groups`,
  name:      `groups`,
  component: groups,
  meta:      {
    title:      `Groups`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeAdmin = {
  path:      `/admin`,
  name:      `admin`,
  component: admin,
  meta:      {
    title:      `Administration`,
    icon:       `mdi-shield-key`,
    isNav:      true,
    middleware: auth
  },
  children: [
    // routeAdminApi,
    routeAdminGroups,
    // routeAdminPermissions,
    routeAdminSettings,
    routeAdminUsers
  ]
}

const routeExplore = {
  path:      `/explore`,
  name:      `explore`,
  component: explore,
  meta:      {
    title:      `Explore`,
    icon:       `mdi-compass-outline`,
    isNav:      true,
    middleware: auth
  }
}

const routeDashboard = {
  path:      `/dashboard`,
  name:      `dashboard`,
  component: dashboard,
  meta:      {
    title:      `Dashboard`,
    icon:       `mdi-view-dashboard`,
    isNav:      true,
    middleware: auth
  }
}

const routeLogin = {
  path:      `/login`,
  name:      `login`,
  component: login,
  meta:      {
    title:      `Login`,
    icon:       `mdi-account`,
    isNav:      false,
    middleware: loginMiddleware
  }
}

const routeMyDataImported = {
  path:      `imported`,
  name:      `imported`,
  component: filesImported,
  meta:      {
    title:      `My Imports`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeMyDataPurchased = {
  path:      `purchased`,
  name:      `purchased`,
  component: purchased,
  meta:      {
    title:      `My Purchases`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeMyDataStream = {
  path:      `stream`,
  name:      `stream`,
  component: stream,
  meta:      {
    title:      `Import/Export`,
    icon:       `mdi-circle-small`,
    isNav:      true,
    middleware: auth
  }
}

const routeMyData = {
  path:      `/my-data`,
  name:      `my-data`,
  component: myData,
  meta:      {
    title:      `My Data`,
    icon:       `mdi-cloud`,
    isNav:      true,
    middleware: auth
  },
  children: [
    routeMyDataStream,
    routeMyDataImported,
    routeMyDataPurchased,
  ]
}

const routeRegister = {
  path:      `/register`,
  name:      `register`,
  component: register,
  meta:      {
    title:      `Register`,
    isNav:      false,
    middleware: null
  },
  children: null
}

// const routeSelfServiceAudiences = {
//   path:      `audience`,
//   name:      `audience`,
//   component: audience,
//   meta:      {
//     title:      `Find Audience`,
//     icon:       `mdi-circle-small`,
//     isNav:      true,
//     middleware: auth
//   }
// }

// const routeSelfService = {
//   path:      `/self-service`,
//   name:      `self-service`,
//   component: selfService,
//   meta:      {
//     title:      `Self-Service`,
//     icon:       `mdi-cursor-pointer`,
//     isNav:      true,
//     middleware: auth
//   },
//   children: [routeSelfServiceAudiences]
// }

async function auth ({ next, router }) {
  // return next() // NOTE: Temporary measure to work while server is offline
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) return next()
  return router.push(`/login`).catch(err => {})
}

async function loginMiddleware ({ next, router }) {
  // const isLoggedIn = false
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) router.push(`/dashboard`)
  return next()
}

function getSession () {
  try {
    return JSON.parse(localStorage.getItem(`vuex`)).session
  } catch (e) {
    return null
  }
}

async function getIsLoggedIn () {
  const session = await getSession()
  if (!session) return false
  return session.active.status.isLoggedIn && session.active.status.token && session.active.user
}

const routes = [
  routeAdmin,
  routeDashboard,
  routeExplore,
  routeHome,
  routeLogin,
  routeMyData,
  routeNotFound,
  routeRegister,
  // routeSelfService,
  // routeTester
]

export default routes
