import React from 'react'

type Props = {
  children: React.ReactNode;
}

const ScrollItem = ({ children }: Props) => {
  return (
    <div>{children}</div>
  )
}

export default ScrollItem
