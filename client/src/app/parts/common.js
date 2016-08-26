export default function(Resources, Actions, Containers, Reducers, Routes, Middleware, context, rest) {
  let resources = Resources(rest)
  let actions = Actions(rest);
  let containers = Containers(context, actions, resources)
  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes: (store) => Routes(containers, store, actions),
      middlewares: [Middleware(actions)]
  }
}
