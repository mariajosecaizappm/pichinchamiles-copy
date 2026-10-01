"use client"

import { Button } from "@/presentation/components/Form/components/Button";

type Props = React.ComponentProps<typeof Button>

const AddToCart = ({ ...props }: Props) => {

    return (
        <Button
            color="primary"
            type="submit"
            {...props}
        >
            Agregar al carrito
        </Button>
    );
};

export default AddToCart;
