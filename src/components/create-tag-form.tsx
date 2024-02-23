import { Check, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "./ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import unorm from 'unorm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createTagSchema = z.object({
    title: z.string().min(3, {message: 'Mínimo de 3 caracteres na tag'}),
}) 

type CreateTagSchema = z.infer<typeof createTagSchema>

function getSlugFromString(input: string): string {
    return unorm
        // normaliza caracteres acentuados para seus equivalentes não acentuados (NFD)
        .nfkd(input)
        // remove caracteres acentuados restantes após a normalização
        .replace(/[\u0300-\u036f]/g, "")
        // converte todos os caracteres para minúsculas
        .toLowerCase()
        // remove caracteres que não são letras, números ou espaços
        .replace(/[^\w\s]/g, '')
        // substitui espaços por hifens
        .replace(/\s+/g, '-')
}

export function CreateTagForm() {
    const queryClient = useQueryClient()

    const { register, handleSubmit, watch, formState } = useForm<CreateTagSchema>({
        // estratégia de validação do forms
        resolver: zodResolver(createTagSchema)
    })

    const slug = watch('title') ? getSlugFromString(watch('title')) : ''

    const { mutateAsync } = useMutation({
        mutationFn: async ({ title }: CreateTagSchema) => {
            // delay 2s
            await new Promise(resolve => setTimeout(resolve, 2000))

            await fetch('http://localhost:3000/tags', {
            method: 'POST',
            body: JSON.stringify({
                title,
                slug,
                amountOfVideos: 0
            }),
        })
        },
        onSuccess: () => {
            // dados retornados por uma query não são mais válidos
            // então ela atualizará os dados
            queryClient.invalidateQueries({
                queryKey: ['get-tags']
            })
        }
    })

    async function createTag({ title }: CreateTagSchema) {
        await mutateAsync({ title })
    }

    return (
        <form onSubmit={handleSubmit(createTag)} className='w-full space-y-6'>
            <div className='space-y-2'>
                <label className='text-sm font-medium block' htmlFor='title'>Nome da Tag</label>
                <input 
                    {...register('title')}
                    id='name' 
                    type="text"
                    className='bg-zinc-800/50 border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm'
                />

                {formState.errors?.title && (
                    <p className='text-sm text-red-500/80'>{formState.errors.title.message}</p>
                )}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium block' htmlFor='slug'>Slug</label>
                <input 
                    id='slug' 
                    type="text" 
                    readOnly 
                    value={slug}
                    className='bg-zinc-800/50 border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm'
                />
            </div>

            <div className='flex items-center justify-end gap-2'>
                <Dialog.Close asChild>
                    <Button>Cancelar</Button>
                </Dialog.Close>
                <Button disabled={formState.isSubmitting} type="submit" className='bg-teal-400 text-teal-950'>
                    {formState.isSubmitting ? <Loader2 className='size-3 animate-spin' /> : <Check className='size-3' /> }
                    Salvar
                </Button>
            </div>
        </form>
    )
}