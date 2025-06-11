// used to break apart camel case schema fields into
// individual words first word capitalized
export function upper(word: string) {
    let split = word.split(/(?=[A-Z])/)
    let r = ''
    split.forEach((w: string) => {
        r += w.charAt(0).toUpperCase() + w.substring(1) + " "
    })
    return r.trim()
}

export function dateToString(date: string) {
    return date.substring(0, 4) + '/' + date.substring(5, 7) + '/' + date.substring(8, 10)
}

export function abbrevSalaryType(salaryType: string) {
    return salaryType === 'yearly' ? 'yr' : salaryType === 'monthly' ? 'month' : salaryType === 'hourly' ? 'hr' : ''
}

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function scrollTo(num: number) {
    window.scrollTo({ top: num, behavior: 'smooth' })
}

export function numberToMoney(number: number | string | null) {
    if (!number) { return }
    if (typeof number === "string") { number = +number }
    number = number.toLocaleString()
    return number
}

export function validateInputDate(input: string) {
    const today = new Date()
    const date = new Date(input)
    return date <= today
}

export function validateInputText(input: string) {
    return input.length > 0
}

export function validateNumberTextInput(input: string) {
    console.log(typeof input === 'string' && (/^[0-9]+$/.test(input)))
    return (typeof input === 'string' && (/^[0-9]+$/.test(input)))
}

// removes any - from input
export function formatEnum(input: string) {
    const split = input.split("-")

    if (split.length <= 1) {
        console.log("WARNING: No need to format enum.")
        return input
    }

    let formatted = split[0]
    split[0] = ''

    split.forEach((word) => {
        formatted += word.substring(0, 1).toUpperCase() + word.substring(1, word.length)
    })

    return formatted
}