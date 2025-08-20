import AddressMenuOpts from './addressMenuOpts'
import AddressEditOpt from './addressEditOpt'

const AddressCard = ({ menu, address, setData }) => {
    return (
        <div className="address border border-dashed border-[rgba(0,0,0,0.2)] py-4 px-6 rounded-lg flex justify-between items-center mt-5">
            <div className='addressText'>
                <h3 className='text-[1.2rem] font-[600] bg-[rgba(0,0,0,0.09)] py-1 px-2 w-max mb-2 capitalize'>{address.addressOf}</h3>
                <div className="contactInfo flex gap-3 items-center text-[1.4rem]">
                    <p className='capitalize font-[550]'>{address.user.name}</p>
                    <span className='font-[440]'>+92 {address.phone}</span>
                </div>
                <p className='addressLine text-[1.3rem] font-[440] capitalize'>{address.addressLine}</p>
            </div>
            <div className="addressOpt">
                {menu ?
                    <AddressMenuOpts address={address} setData={setData}/>
                    :
                    <AddressEditOpt address={address} setData={setData} />}
            </div>
        </div>
    )
}

export default AddressCard
