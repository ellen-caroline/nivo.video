import { Check } from 'lucide-react'
import { Button } from "./ui/button";

export function CreateTagForm() {
    return (
        <form className='w-full space-y-6'>
            <div className='space-y-2'>
                <label className='text-sm font-medium block' htmlFor='name'>Nome da Tag</label>
                <input 
                    id='name' 
                    type="text"
                    className='bg-zinc-800/50 border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm'
                />
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium block' htmlFor='slug'>Slug</label>
                <input 
                    id='slug' 
                    type="text" 
                    readOnly 
                    className='bg-zinc-800/50 border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm'
                />
            </div>

            <div className='flex items-center justify-end gap-2'>
                <Button>Cancelar</Button>
                <Button type="submit" className='bg-teal-400 text-teal-950'>
                    <Check className='size-3' />
                    Salvar
                </Button>
            </div>
        </form>
    )
}