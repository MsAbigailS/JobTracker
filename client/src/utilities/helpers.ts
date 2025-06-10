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

export function validateInput(key: string, input: string | number) {
    const now = new Date();
    if ((key === 'role' || key === 'company') && !(typeof input === 'string' && input.length > 0)) { return false }
    if ((key) === 'salary' && (typeof input === 'string' && (!/^[0-9]+$/.test(input)))) { return false }
    if ((key === 'dateApplied') && !(typeof input === 'string' && +(input.substring(0, 4)) >= +(now.getFullYear()) && +(input.substring(5, 7)) <= +(now.getMonth()) + 1 && +(input.substring(8, 10)) <= +(now.getDate()))) { return false }
    return true
}