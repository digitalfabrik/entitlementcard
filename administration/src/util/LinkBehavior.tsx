import React from 'react'
import { Link, LinkProps } from 'react-router'

// https://mui.com/material-ui/integrations/routing/#link
const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  // Map href (Material UI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />
})
export default LinkBehavior
