import { Variants } from 'framer-motion'

export const pageTransitions: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const fadeInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const fadeInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

export const slideInFromBottom: Variants = {
  initial: { 
    opacity: 0, 
    y: 100 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

export const parallaxScroll = {
  y: [0, -50],
  transition: { 
    duration: 2, 
    repeat: Infinity, 
    repeatType: 'reverse' as const,
    ease: 'easeInOut'
  }
}

export const floatingAnimation: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const rotateAnimation: Variants = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

export const shimmerAnimation: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

export const hoverLift: Variants = {
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

export const morphingBlob: Variants = {
  animate: {
    borderRadius: [
      '60% 40% 30% 70%/60% 30% 70% 40%',
      '30% 60% 70% 40%/50% 60% 30% 60%',
      '60% 40% 30% 70%/60% 30% 70% 40%'
    ],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const typewriterAnimation = {
  hidden: {
    width: 0
  },
  visible: {
    width: '100%',
    transition: {
      duration: 2,
      ease: 'linear',
      delay: 0.5
    }
  }
}

export const glitchAnimation: Variants = {
  animate: {
    x: [0, -2, 2, 0],
    y: [0, 2, -1, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut'
    }
  }
}