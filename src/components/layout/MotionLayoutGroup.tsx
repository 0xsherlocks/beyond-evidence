"use client";

import React from 'react';
import { LayoutGroup } from 'framer-motion';

export default function MotionLayoutGroup({ children }: { children: React.ReactNode }) {
  return <LayoutGroup id="site-shell">{children}</LayoutGroup>;
}