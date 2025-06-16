import StoreProviders from "@/components/Provider/StoreProvider";

const checkoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <StoreProviders>{children}</StoreProviders>
    </div>
  );
};

export default checkoutLayout;
