import { IoClose } from 'react-icons/io5'
import CustomTextField from '../customTextField'
import { Button, Drawer, FormControlLabel, InputAdornment, Radio, RadioGroup } from '@mui/material'
import { Controller } from 'react-hook-form'

const AddressDrawer = ({ toggleDrawer, openDrawer, onSubmit, onError, handleSubmit, register, isSubmitting, control }) => {

    return (
        <Drawer open={openDrawer} anchor='right' onClose={() => toggleDrawer(false)}>
            <div className="w-[30vw]">
                <div className="addressPanelHead flex justify-between  items-center py-4 px-8 border-b border-[rgba(0,0,0,0.3)] mb-10">
                    <h2 className="text-[2rem] font-[600]">Add Address</h2>
                    <Button className='!rounded-full !min-w-auto !p-3 !text-[#3e3e3e]' onClick={() => toggleDrawer(false)}>
                        <IoClose className='text-[2.2rem]' />
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit, onError)} className='w-full px-5'>
                    <div className="addressFormBody flex flex-col gap-8">
                        <CustomTextField
                            label={'Address Line'}
                            {...register('addressLine', { required: `Address Line is Required` })}
                        />
                        <CustomTextField
                            label={'City'}
                            {...register('city', { required: `City name is Required` })}
                        />
                        <CustomTextField
                            label={'State'}
                            {...register('state', { required: `State name is Required` })}
                        />
                        <CustomTextField
                            type={'number'}
                            label={'Zip Postal Code'}
                            {...register('postalCode', { required: `Zip Postal Code is Required` })}
                        />
                        <CustomTextField
                            label={'Landmark'}
                            {...register('landmark', { required: `Landmark is Required` })}
                        />
                        <CustomTextField
                            type={'tel'}
                            label="Phone"
                            {...register('phone', {
                                required: `Phone number is Required`,
                                minLength: { value: 10, message: `Kindly Enter a valid Phone number` },
                                maxLength: { value: 10, message: `Kindly Enter a valid Phone number` }
                            })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" className='!m-0'>
                                        <div className="flex items-center gap-2 pl-1 w-max self-center">
                                            <img src="img/pak.jpg" alt="flag" className="w-[2.2rem]" />
                                            <span className="text-[#3e3e3e] text-[1.5rem] font-medium">+92</span>
                                        </div>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <div className="flex flex-col gap-3">
                            <h3 className='text-[1.8rem] font-medium'>Address Of</h3>
                            <Controller
                                name="addressOf"
                                control={control}
                                rules={{ required: 'Address Type is Required' }}
                                render={({ field }) => (
                                    <RadioGroup row {...field}>
                                        <FormControlLabel value="home" control={<Radio size="large" />} label="Home" />
                                        <FormControlLabel value="office" control={<Radio size="large" />} label="Office" />
                                        <FormControlLabel value="other" control={<Radio size="large" />} label="Other" />
                                    </RadioGroup>
                                )}
                            />

                        </div>
                    </div>
                    <Button type='submit' disabled={isSubmitting}
                        className={`
                                        !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mt-6
                                        ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                                    `}
                    >
                        Add Address
                    </Button>

                </form>
            </div>
        </Drawer>
    )
}

export default AddressDrawer
