export const locations = {
  root: () => '/',
  editor: (projectId = ':projectId') => `/editor/${projectId}`,
  signIn: () => '/sign-in'
}
