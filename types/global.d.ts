declare module 'react' {
  export * from 'react';
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
  
  type ImageProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    className?: string;
  } & Omit<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src' | 'alt'>;
  
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
  
  type LinkProps = {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
  } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'href'>;
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'react-icons/fa' {
  import { ComponentType, SVGAttributes } from 'react';
  
  type IconProps = SVGAttributes<SVGElement>;
  
  export const FaTrash: ComponentType<IconProps>;
  export const FaArrowLeft: ComponentType<IconProps>;
  export const FaCreditCard: ComponentType<IconProps>;
  export const FaShoppingCart: ComponentType<IconProps>;
  export const FaUser: ComponentType<IconProps>;
  export const FaBars: ComponentType<IconProps>;
  export const FaTimes: ComponentType<IconProps>;
}

declare module '@/lib/store' {
  type CartItem = {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    quantity: number;
    size?: string;
    color?: string;
  };

  type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: number, size?: string, color?: string) => void;
    updateQuantity: (itemId: number, quantity: number, size?: string, color?: string) => void;
    clearCart: () => void;
  };

  export const useCartStore: () => CartState;
}
